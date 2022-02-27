export interface Users {
          name: string;
          lastname: string;
          username: string;
          dni: number;
          email: string;
          phoneNum: number;
          location: string;
}

export interface Loan {
          id: string;
          dniActualUser: number;
          isbn: number;
}

export interface BookEntered {
          id: string;
          amountBookLent: number;
          isbn: number;
}
