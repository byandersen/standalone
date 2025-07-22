import dataclasses

import cv2
import cv2.detail
import numpy as np
from scipy.spatial import cKDTree


@dataclasses.dataclass
class Feature:
    features: cv2.detail.ImageFeatures
    corner: tuple
    size: tuple
    coords: tuple


class LiveStitching:
    def __init__(self):
        """Handles live stitching by continues adding images, comparing with existing features and blending into the
        bigger picture. It utilizes the opencv suite for feature detection, camera estimation and bundling as well
        as blending."""
        self._detector = cv2.SIFT.create()
        self._matcher = cv2.detail.BestOf2NearestMatcher()
        self._camera_estimator = cv2.detail.AffineBasedEstimator()
        self._camera_adjuster = cv2.detail.BundleAdjusterAffinePartial()

        self.img = None
        self.features: list[Feature] = []
        self.size = None
        self.corner = None

    def get_nearby_features(self, coords):
        if len(self.features) < 3:
            return self.features
        coords_array = np.array([feature.coords for feature in self.features])
        tree = cKDTree(coords_array)

        distances, indices = tree.query(coords, k=3)

        return [self.features[i] for i in indices]

    def add_image(self, img, coords):
        """Try adding image to mini map and returning the new blended image."""
        current_features = cv2.detail.computeImageFeatures2(self._detector, img)

        if self.img is None:  # When its the first image
            self.img = img
            self.size = img.shape[:2]
            self.corner = (0, 0)
            self.features.append(
                Feature(current_features, self.corner, self.size, coords)
            )
            return img

        nearby_features = self.get_nearby_features(
            coords
        )  # Find existing nearby image features by coordinates (n=3)
        if len(nearby_features) == 0:
            print("could not find a good feature")
            return

        nearby_image_features = [x.features for x in nearby_features]

        features = [current_features, *nearby_image_features]

        # Pairwise matches existing features with new image features
        pairwise_matches = self._matcher.apply2(features)
        self._matcher.collectGarbage()

        # Estimates camera matrices
        b, cameras = self._camera_estimator.apply(features, pairwise_matches, None)
        for cam in cameras:
            cam.R = cam.R.astype(np.float32)

        # Run bundle adjustment to minimize general error
        b, cameras = self._camera_adjuster.apply(features, pairwise_matches, cameras)

        # Calculate top left corner position using own and first cameras extrinsic
        second_corner = nearby_features[0].corner
        second_r_relativ_to_new = cameras[1].R

        new_corner = (
            round(
                -(cameras[0].R[0][2]) + second_corner[0] + second_r_relativ_to_new[0][2]
            ),
            round(
                -(cameras[0].R[1][2]) + second_corner[1] + second_r_relativ_to_new[1][2]
            ),
        )

        corners = [self.corner, new_corner]
        sizes = [self.size, img.shape[:2]]

        # Blend using no blender to reduce cpu usage
        blender = cv2.detail.Blender.createDefault(cv2.detail.Blender_NO)
        blender.prepare(corners, [(size[1], size[0]) for size in sizes])

        for img, size, corner in zip([self.img, img], sizes, corners):
            mask = 255 * np.ones((size[0], size[1]), np.uint8)
            blender.feed(img.astype(np.int16), mask, corner)

        result = None
        result_mask = None
        result, result_mask = blender.blend(result, result_mask)

        # Save new composed image and add features
        self.img = cv2.convertScaleAbs(result)
        self.size = self.img.shape[:2]
        self.corner = (
            min(corners[0][0], corners[1][0]),
            min(corners[0][1], corners[1][1]),
        )
        self.features.append(
            Feature(current_features, new_corner, img.shape[:2], coords)
        )

        return self.img
