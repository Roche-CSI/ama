import errno
import logging
import os
import shutil
import stat

logger = logging.getLogger(__file__)


class PathUtils:

    @staticmethod
    def abs_path(relative, base=os.curdir):
        """returns absolute path from base and relative path"""
        # if path is a Path object, fspath converts that to string
        start = os.path.abspath(os.fspath(base))
        return os.path.abspath(os.path.join(start, relative))

    @staticmethod
    def remove(path):
        logger.debug(f"removing {path}")
        try:
            if os.path.isdir(path):
                shutil.rmtree(path, onexc=PathUtils._chmod)
            else:
                PathUtils._unlink(path, PathUtils._chmod)
        except OSError as e:
            if e.errno != errno.ENOENT:
                raise

    @staticmethod
    def _chmod(func, p, exe):  # pylint: disable=unused-argument
        perm = os.lstat(p).st_mode
        perm |= stat.S_IWRITE

        try:
            os.chmod(p, perm)
        except OSError as e:
            # broken symlink or file is not owned by us
            if e.errno not in [errno.ENOENT, errno.EPERM]:
                raise
        func(p)

    @staticmethod
    def _unlink(path, onexc):
        try:
            os.unlink(path)
        except OSError as e:
            onexc(os.unlink, path, e)

    @staticmethod
    def path_link_type(path):
        """Return the linking type of the path.

        Types of links:
        - copy
        - hardlink
        - symlink
        """
        if os.path.islink(path):
            return "symlink"
        if os.stat(path).st_nlink > 1:
            return "hardlink"
        return "copy"
