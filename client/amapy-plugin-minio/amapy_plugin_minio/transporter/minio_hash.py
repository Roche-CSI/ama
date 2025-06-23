import os
import hashlib
import logging
from typing import List, Tuple, Union

logger = logging.getLogger(__name__)

# Standard chunk sizes used by MinIO/S3
STANDARD_CHUNK_SIZES = [
    5 * 1024 * 1024,      # 5MB
    8 * 1024 * 1024,      # 8MB (default for most S3 clients)
    15 * 1024 * 1024,     # 15MB
    64 * 1024 * 1024,     # 64MB
    128 * 1024 * 1024,    # 128MB
]

def normalize_etag(etag: str) -> str:
    """Normalize an etag by removing quotes."""
    if etag.startswith('"') and etag.endswith('"'):
        return etag[1:-1]
    return etag

def is_multipart_etag(etag: str) -> bool:
    """Check if an etag is from a multipart upload."""
    etag = normalize_etag(etag)
    return '-' in etag

def parse_multipart_etag(etag: str) -> Tuple[str, int]:
    """
    Parse a multipart etag into its components.
    
    Args:
        etag: The etag string
        
    Returns:
        Tuple of (hash_value, part_count)
    """
    etag = normalize_etag(etag)
    if not is_multipart_etag(etag):
        return etag, 1
    
    parts = etag.split('-')
    if len(parts) != 2:
        raise ValueError(f"Invalid multipart etag format: {etag}")
    
    try:
        part_count = int(parts[1])
        return parts[0], part_count
    except ValueError:
        raise ValueError(f"Invalid part count in etag: {etag}")

def calculate_file_md5(file_path: str) -> str:
    """Calculate the MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def calculate_multipart_etag(file_path: str, chunk_size: int) -> str:
    """
    Calculate the etag for a multipart upload.
    
    Args:
        file_path: Path to the file
        chunk_size: Size of each part in bytes
        
    Returns:
        The calculated etag
    """
    md5s = []
    
    with open(file_path, 'rb') as f:
        while True:
            data = f.read(chunk_size)
            if not data:
                break
            md5s.append(hashlib.md5(data).digest())
    
    if not md5s:
        return ""
    
    if len(md5s) == 1:
        # Single part
        return hashlib.md5(md5s[0]).hexdigest()
    else:
        # Multipart
        digests = b''.join(md5s)
        etag = hashlib.md5(digests).hexdigest() + f"-{len(md5s)}"
        return etag

def get_possible_chunk_sizes(file_size: int, part_count: int) -> List[int]:
    """
    Get possible chunk sizes for a multipart upload.
    
    Args:
        file_size: Size of the file in bytes
        part_count: Number of parts
        
    Returns:
        List of possible chunk sizes
    """
    # Add the exact chunk size if it's a perfect division
    possible_sizes = list(STANDARD_CHUNK_SIZES)
    if file_size % part_count == 0:
        possible_sizes.append(file_size // part_count)
    
    # Filter out chunk sizes that don't match the part count
    valid_chunk_sizes = []
    for chunk_size in possible_sizes:
        calculated_parts = (file_size + chunk_size - 1) // chunk_size  # ceiling division
        if calculated_parts == part_count:
            valid_chunk_sizes.append(chunk_size)
    
    return valid_chunk_sizes if valid_chunk_sizes else possible_sizes

def calculate_possible_etags(file_path: str, part_count: int) -> List[str]:
    """
    Calculate possible etags for a file based on different chunk sizes.
    
    Args:
        file_path: Path to the file
        part_count: Number of parts from the original etag
        
    Returns:
        List of possible etags
    """
    file_size = os.path.getsize(file_path)
    possible_chunk_sizes = get_possible_chunk_sizes(file_size, part_count)
    
    etags = []
    for chunk_size in possible_chunk_sizes:
        etag = calculate_multipart_etag(file_path, chunk_size)
        etags.append(etag)
    
    return etags

def verify_etag(file_path: str, etag: str) -> bool:
    """
    Verify that a file matches an etag.
    
    Args:
        file_path: Path to the file
        etag: The etag to verify against
        
    Returns:
        True if the file matches the etag, False otherwise
    """
    etag = normalize_etag(etag)
    
    # Check if this is a multipart etag
    if is_multipart_etag(etag):
        # Parse the multipart etag
        _, part_count = parse_multipart_etag(etag)
        
        # Calculate possible etags for the file
        possible_etags = calculate_possible_etags(file_path, part_count)
        
        # Check if any of the possible etags match
        for possible_etag in possible_etags:
            if possible_etag == etag:
                return True
        
        # If we get here, none of the possible etags matched
        return False
    else:
        # For single-part uploads, just compare MD5 hashes
        file_md5 = calculate_file_md5(file_path)
        return file_md5 == etag