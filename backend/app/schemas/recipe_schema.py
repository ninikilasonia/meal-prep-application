from pydantic import BaseModel, ConfigDict, Field, field_validator


ALLOWED_MEAL_TYPES = {"breakfast", "lunch", "dinner", "snack"}


class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    quantity: float = Field(gt=0)


class RecipeIngredientResponse(RecipeIngredientCreate):
    id: int
    name: str | None = None

    model_config = ConfigDict(from_attributes=True)


class RecipeBase(BaseModel):
    name: str
    description: str | None = None
    meal_type: str
    base_servings: float = Field(default=1, gt=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Recipe name cannot be empty")
        return value

    @field_validator("meal_type")
    @classmethod
    def validate_meal_type(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_MEAL_TYPES:
            allowed_values = ", ".join(sorted(ALLOWED_MEAL_TYPES))
            raise ValueError(f"Meal type must be one of: {allowed_values}")
        return value


class RecipeCreate(RecipeBase):
    ingredients: list[RecipeIngredientCreate] = Field(default_factory=list)


class RecipeUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    meal_type: str | None = None
    base_servings: float | None = Field(default=None, gt=0)
    ingredients: list[RecipeIngredientCreate] | None = None

    @field_validator("name")
    @classmethod
    def validate_optional_name(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()
        if not value:
            raise ValueError("Recipe name cannot be empty")
        return value

    @field_validator("meal_type")
    @classmethod
    def validate_optional_meal_type(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_MEAL_TYPES:
            allowed_values = ", ".join(sorted(ALLOWED_MEAL_TYPES))
            raise ValueError(f"Meal type must be one of: {allowed_values}")
        return value


class RecipeResponse(RecipeBase):
    id: int
    ingredients: list[RecipeIngredientResponse] = Field(default_factory=list)
    total_calories: float = 0
    total_protein: float = 0
    total_carbohydrates: float = 0
    total_fat: float = 0
    total_fiber: float = 0
    calories_per_serving: float = 0
    protein_per_serving: float = 0
    carbohydrates_per_serving: float = 0
    fat_per_serving: float = 0
    fiber_per_serving: float = 0

    model_config = ConfigDict(from_attributes=True)
