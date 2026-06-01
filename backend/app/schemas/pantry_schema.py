from pydantic import BaseModel, ConfigDict, Field


class PantryItemBase(BaseModel):
    ingredient_id: int
    available_quantity: float = Field(default=0, ge=0)


class PantryItemCreate(PantryItemBase):
    pass


class PantryItemUpdate(BaseModel):
    ingredient_id: int | None = None
    available_quantity: float | None = Field(default=None, ge=0)


class PantryItemResponse(PantryItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
