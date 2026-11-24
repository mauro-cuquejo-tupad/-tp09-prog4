from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.deps import get_current_active_user, require_role
from app.core.uow import UnitOfWork, get_uow
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(
    data: UserCreate,
    uow: Annotated[UnitOfWork, Depends(get_uow)]
):
    with uow:
        service = UsuarioService(uow)
        return service.register(data)

@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
    response: Response,
):
    with uow:
        service = UsuarioService(uow)
        token_str = service.authenticate(form_data.username, form_data.password)
        response.set_cookie(
            key="access_token",
            value=token_str,
            httponly=True,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
            secure=False,
        )
        return {"mensaje": "Login exitoso. Sesión iniciada."}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
    )
    return {"mensaje": "Sesión cerrada exitosamente"}

@router.get("/me", response_model=UserPublic)
def get_me(
    current_user: Annotated[UserPublic, Depends(get_current_active_user)]
):
    return current_user

@router.get("/admin/usuarios", response_model=List[UserPublic])
def list_usuarios_admin(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    with uow:
        service = UsuarioService(uow)
        return service.list_all_admin()

@router.post("/admin/usuarios/{id}/activar", response_model=UserPublic)
def activar_usuario(
    id: int,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    with uow:
        service = UsuarioService(uow)
        return service.activar(id)

@router.post("/admin/usuarios/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    uow: Annotated[UnitOfWork, Depends(get_uow)],
):
    with uow:
        service = UsuarioService(uow)
        return service.desactivar(id)
