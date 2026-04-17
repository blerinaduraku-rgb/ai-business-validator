// Singleton Pattern: Siguron që aplikacioni ka vetëm një instancë të menaxherit të AI.
class AIClient {
  private static instance: AIClient;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || "";
  }

  // Metoda statike që kontrollon nëse instanca ekziston, nëse jo e krijon atë.
  public static getInstance(): AIClient {
    if (!AIClient.instance) {
      AIClient.instance = new AIClient();
    }
    return AIClient.instance;
  }

  public async validate(idea: string) {
    console.log(`Duke përdorur API Key: ${this.apiKey.substring(0, 5)}...`);
    // Logjika e fetch këtu...
    return `Analiza për idenë: ${idea}`;
  }
}

// Demo e përdorimit:
const client1 = AIClient.getInstance();
const client2 = AIClient.getInstance();

console.log("A janë të njëjtat instanca?", client1 === client2); // true


/**
 * Pse Singleton? 
 * Zgjodha Singleton për AIClient sepse krijimi i lidhjeve me API të jashtme 
 * është i kushtueshëm për memorien. Kjo siguron që kemi vetëm një pikë 
 * qendrore komunikimi me Hugging Face.
 */