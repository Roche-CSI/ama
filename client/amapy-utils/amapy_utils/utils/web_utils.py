import os
import webbrowser


def open_in_browser(url: str) -> bool:
    """Open url in user's default browser."""
    if os.path.exists(os.path.realpath(url)):
        # local file
        url = "file://" + os.path.realpath(url)
    try:
        webbrowser.open(url)
        return True
    except webbrowser.Error as e:
        print(f"error opening browser: {e}")
        return False
