import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ErrorValidationService {
  constructor() {}

  SignInErrors(err: string) {
    let msg;
    switch (err.toLowerCase()) {
      case "auth/invalid-email":
        msg = "Email inválido";
        break;
      case "auth/user-disabled":
        msg = "Usuário Desabilitado";
        break;
      case "auth/user-not-found":
        msg = "Usuário não encontrado";
        break;
      case "auth/wrong-password":
        msg = "Senha inválida";
        break;
      case "auth/wrong-password":
        msg = "Senha inválida";
        break;
      default:
        msg = "Ocorreu um erro ao se logar";
    }
    return msg;
  }

  SignUpErrors(err: string) {
    let msg;
    switch (err.toLowerCase()) {
      case "auth/invalid-email":
        msg = "Email inválido";
        break;
      case "auth/operation-not-allowed":
        msg = "Conta Desabilitada";
        break;
      case "auth/email-already-in-use":
        msg = "Email já está em uso";
        break;
      case "auth/weak-password":
        msg = "A senha precisa ter pelo menos 6 caracteres";
        break;
      default:
        msg = "Ocorreu um erro ao se registrar";
    }
    return msg;
  }

  ForgotPassErrors(err: string) {
    let msg;
    switch (err.toLowerCase()) {
      case "auth/invalid-email":
        msg = "Email inválido";
        break;
      case "auth/operation-not-allowed":
        msg = "Conta Desabilitada";
        break;
      case "auth/email-already-in-use":
        msg = "Email já está em uso";
        break;
      case "auth/weak-password":
        msg = "A senha precisa ter pelo menos 6 caracteres";
        break;
      default:
        msg = "Ocorreu um erro ao enviar email ";
    }
    return msg;
  }
}
