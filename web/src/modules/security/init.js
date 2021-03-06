/* eslint-disable */
import Keycloak from "keycloak-js";
import store from "@/store";

const keycloakFileName = process.env.VUE_APP_KEYCLOAK_JSON_FILENAME
  ? process.env.VUE_APP_KEYCLOAK_JSON_FILENAME
  : "keycloak-local";
// const keycloakAuth = new Keycloak(`/statics/${keycloakFileName}.json`);
const keycloakAuth = new Keycloak(`/${keycloakFileName}.json`);
let userRoles = [];
const pageBasedOnRole = role => {
  let page = "Unauthorized";
  switch (role) {
    case "User":
      page = "timemachineIntakeIntroduction";
      break;
    case "PSB_User":
      page = "projects";
      break;
    case "PSB_Intake_User":
      page = "projects";
      break;
    case "PSB_Admin":
      page = "projects";
      break;
    case "manage_finances":
      page = "timemachineFinance";
      break;
    default:
      break;
  }
  return page;
};

export default (next, roles, isLoggedIn = false) => {
  keycloakAuth
    .init({ onLoad: "login-required", responseMode: "query", checkLoginIframe: false })
    .success(() => {
      keycloakAuth.logoutUrl =
        `${keycloakAuth.authServerUrl}/realms/${keycloakAuth.realm}` +
        `/protocol/openid-connect/logout?redirect_uri=${document.baseURI}`;
      store.dispatch("authLogin", keycloakAuth);
      if (roles) {
        let hasAccess = false;
        let keycloakRole;
        roles.forEach(role => {
          if (keycloakAuth.hasRealmRole(role)) {
            hasAccess = true;
            keycloakRole = role;
            userRoles.push(role);
          }
        });

        if (hasAccess) {
          // Different landing pages for users according to role
          if (isLoggedIn) {
            const page = pageBasedOnRole(keycloakRole);
            next({ name: page });
          } else {
            next();
          }
        } else {
          next({ name: "Unauthorized" });
        }
      } else {
        next();
      }

      setInterval(() => {
        keycloakAuth
          .updateToken(70)
          .success(refreshed => {
            if (refreshed) {
              store.dispatch("authLogin", keycloakAuth);
            }
          })
          .error(() => {
            console.error("Failed to refresh token");
          });
      }, 60000);
    })
    .error(() => {
      console.log("failed to login");
    });
};
export function getRoles() {
  return userRoles;
}
/** Returns link to Keycloak server, useful for admins to login */
export function getAuthURL() {
  return `${keycloakAuth.authServerUrl}/admin/${keycloakAuth.realm}/console`;
}
