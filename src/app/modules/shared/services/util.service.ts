import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // Inyecciones de dependencias
  private keycloakService = inject(KeycloakService);

  constructor() { }

  /**
   * Obtencion de Roles asignados al usuario del login de keycloak
   * @returns string[]  Roles del usuario
   */
  getRoles(): string[] {

    let roles: string[] = this.keycloakService.getUserRoles();

    return roles;
  }

  /**
   * Verifica si el usuario tiene asignado el role Admin o no
   * @returns boolean Indica si es usuario Admin o no
   */
  isAdmin(): boolean {
    // Obtencion de los roles del usuario
    // ---> Nos quedamos con el role "admin"
    let roles: string[] = this.keycloakService.getUserRoles().filter( role => role == "admin" );

    // Si hemos encontrado el role "admin" en el usuario
    if (roles.length > 0) {
      return true;
    } else {
      return false;
    }

  }

}
