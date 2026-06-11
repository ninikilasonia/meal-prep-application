from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.shopping_list_schema import ShoppingListItemResponse
from app.services import shopping_list_service


router = APIRouter(prefix="/shopping-list", tags=["shopping-list"])


@router.get("", response_model=list[ShoppingListItemResponse])
def get_shopping_list(
    db: Session = Depends(get_db),
) -> list[ShoppingListItemResponse]:
    return shopping_list_service.generate_shopping_list(db)
