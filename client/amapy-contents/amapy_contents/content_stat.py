from .file_stat import FileStat


class ContentStat(FileStat):
    refs: list[str] = []  # number of object references
    hash: str | None = None

    def __init__(self, id: str | None = None, src: str | None = None) -> None:
        super().__init__(id, src)
        self.refs = []

    def add_ref(self, ref: str) -> None:
        if ref not in self.refs:
            self.refs.append(ref)

    def remove_ref(self, ref: str) -> None:
        if ref in self.refs:
            self.refs.remove(ref)

    def serialize(self) -> dict:
        data = {key: getattr(self, key) for key in self.__class__.serialize_fields()}
        return data

    @classmethod
    def de_serialize(cls, data: dict) -> ContentStat:
        data = data or {}
        ref = ContentStat()
        for key in cls.serialize_fields():
            setattr(ref, key, data.get(key))
        if ref.refs is None:
            ref.refs = []
        return ref

    @classmethod
    def serialize_fields(cls) -> list[str]:
        return [
            "id",  # file id
            "content_time",  # last content modification time
            "metadata_time",  # number of hardlinks
            "num_links",  # time of last metadata change
            "inode",  # inode number
            "size",  # file size
            "refs",
            "hash"
        ]

    def __repr__(self) -> str:
        return self.id
