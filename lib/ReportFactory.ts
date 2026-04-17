// 1. Definojmë një Interface që të gjitha raportet duhet ta ndjekin
export interface IReport {
  generate(): string;
}

// 2. Krijojmë klasat që implementojnë Interface-in
// Sigurohu që i shton "export" përpara çdo klase
export class QuickReport implements IReport {
  generate(): string {
    return "Raport i shpejtë: Ideja ka potencial të lartë!";
  }
}

export class DetailedReport implements IReport {
  generate(): string {
    return "Raport i detajuar: Analiza SWOT, tregu dhe strategjia e rritjes.";
  }
}

// 3. Factory Class
export class ReportFactory {
  // Metoda statike për krijimin e raporteve
  public static createReport(type: "quick" | "detailed"): IReport {
    if (type === "quick") {
      return new QuickReport();
    } else if (type === "detailed") {
      return new DetailedReport();
    }
    throw new Error("Ky lloj raporti nuk ekziston.");
  }
}


/**
 * Pse Factory? 
 * Zgjodha Factory për ReportFactory sepse aplikacioni mund të ketë lloje 
 * të ndryshme analizash (shpejtë/detajuar). Kjo e bën kodin lehtësisht 
 * të zgjerueshëm pa ndryshuar logjikën ekzistuese të UI-së.
 */