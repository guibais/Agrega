import { Injectable } from "@angular/core";
import * as dateFns from "date-fns";

@Injectable({
  providedIn: "root"
})
export class DateService {
  constructor() {}

  checkDate(date) {
    const dateNow = new Date();
    const diffDays = dateFns.differenceInCalendarDays(date, dateNow);
    const diffWeeks = dateFns.differenceInCalendarWeeks(date, dateNow);
    const diffMonths = dateFns.differenceInCalendarMonths(date, dateNow);

    if (diffDays == 0) return "Hoje";
    if (diffDays == 1) return "Amanha";
    if (diffDays == 2) return "Depois de Amanha";
    if (diffDays == 3) return "Em três dias";
    if (diffDays == 4) return "Em quatro dias";
    if (diffDays == 5) return "Em cinco dias";
    if (diffDays == 6) return "Em seis dias";
    if (diffWeeks <= 1) return "Em uma Semana";
    if (diffWeeks <= 2) return "Em duas Semana";
    if (diffWeeks <= 3) return "Em três Semana";
    if (diffMonths <= 1) return "Em um Mês";
    if (diffMonths <= 2) return "Em dois Meses";
    if (diffMonths <= 3) return "Em três Meses";

    return date;
  }
}
