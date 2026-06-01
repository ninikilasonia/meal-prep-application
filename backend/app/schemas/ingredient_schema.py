from pydantic import BaseModel, ConfigDict, Field, field_validator


class IngredientBase(BaseModel):
    name: str
    unit: str
    calories: float = Field(default=0, ge=0)
    protein: float = Field(default=0, ge=0)
    carbohydrates: float = Field(default=0, ge=0)
    fat: float = Field(default=0, ge=0)
    fiber: float = Field(default=0, ge=0)

    @field_validator("name", "unit")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value


class IngredientCreate(IngredientBase):
    pass


class IngredientUpdate(BaseModel):
    name: str | None = None
    unit: str | None = None
    calories: float | None = Field(default=None, ge=0)
    protein: float | None = Field(default=None, ge=0)
    carbohydrates: float | None = Field(default=None, ge=0)
    fat: float | None = Field(default=None, ge=0)
    fiber: float | None = Field(default=None, ge=0)

    @field_validator("name", "unit")
    @classmethod
    def validate_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value


class IngredientResponse(IngredientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
