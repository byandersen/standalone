import numpy as np
from scipy import ndimage, fftpack

def sharpness_sum_lap2(rgb_image: np.ndarray) -> float:
    """Original Laplacian-basierte Methode."""
    image_bw = np.mean(rgb_image, axis=2)
    image_lap = ndimage.laplace(image_bw)
    return float(np.mean(image_lap.astype(float) ** 4))

def sharpness_laplace_variance(rgb_image: np.ndarray) -> float:
    """Varianz des Laplace-Operators."""
    image_bw = np.mean(rgb_image, axis=2)
    lap = ndimage.laplace(image_bw)
    return float(np.var(lap))

def sharpness_tenengrad(rgb_image: np.ndarray) -> float:
    """Tenengrad-Methode basierend auf Sobel-Kanten."""
    image_bw = np.mean(rgb_image, axis=2)
    gx = ndimage.sobel(image_bw, axis=0)
    gy = ndimage.sobel(image_bw, axis=1)
    g2 = gx ** 2 + gy ** 2
    return float(np.mean(g2))

def sharpness_fft_energy(rgb_image: np.ndarray) -> float:
    """Frequenzbasierte Methode: Hochfrequenzenergie."""
    image_bw = np.mean(rgb_image, axis=2)
    f = fftpack.fft2(image_bw)
    fshift = fftpack.fftshift(f)
    magnitude_spectrum = np.abs(fshift)
    center = np.array(magnitude_spectrum.shape) // 2
    mask = np.ones_like(magnitude_spectrum)
    r = 10  # Radius des Zentrums, das ignoriert wird (Niedrigfrequenz)
    Y, X = np.ogrid[:mask.shape[0], :mask.shape[1]]
    dist = np.sqrt((X - center[1]) ** 2 + (Y - center[0]) ** 2)
    mask[dist < r] = 0
    return float(np.mean(magnitude_spectrum * mask))

def get_sharpness_function(name: str):
    """Gibt die entsprechende Schärfefunktion basierend auf dem Namen zurück."""
    name = name.lower()
    if name == "laplace4":
        return sharpness_sum_lap2
    elif name == "variance":
        return sharpness_laplace_variance
    elif name == "tenengrad":
        return sharpness_tenengrad
    elif name == "fft":
        return sharpness_fft_energy
    else:
        raise ValueError(f"Unknown sharpness metric: {name}")