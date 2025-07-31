from .base import BaseModel


class ReadOnlyModel(BaseModel):

    def save(self, force_insert=False):
        """Override save so we can enforce readonly behaviour"""
        if not self.is_create:
            raise Exception(self.__class__.read_only_error())
            # raise Exception(f"{self.__class__} is readonly and can not be updated")
        super(ReadOnlyModel, self).save(force_insert)

    @classmethod
    def read_only_error(cls):
        return f"{cls.__name__} is readonly and can not be updated"

