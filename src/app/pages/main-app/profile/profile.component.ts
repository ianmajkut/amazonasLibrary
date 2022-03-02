import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, tap } from 'rxjs';
import { Users } from 'src/app/interfaces/interfaces';
import { BooksService } from 'src/app/services/books.service';
import { SignUpService } from 'src/app/services/sign-up.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .card-table {
        word-break: break-all;
      }

      @media (max-width: 466px) {
        .card-table {
          font-size: 0.7rem;
        }
        .btn {
          font-size: 0.7rem;
        }
      }
    `
  ]
})
export class ProfileComponent implements OnInit {
  userEmailParam!: string;
  user!: Observable<any>;
  myUser!: any;
  myBooks: any[] = [];

  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  //Min length 7 and max length 8
  dniPattern: string = '^[0-9]{7,8}';

  constructor(
    private activeRoute: ActivatedRoute,
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private spinner: NgxSpinnerService,
    private bookService: BooksService
  ) {
    this.spinner.show();

    //Getting the email passed by the url
    this.userEmailParam = this.activeRoute.snapshot.params['userEmail'];

    //Check of the user logged
    this.auth.authState.subscribe((user) => {
      //If user is logged
      if (user) {
        let emailLower = user?.email?.toLowerCase();
        //Query to obtain the user on the database using the email
        this.user = this.firestore
          .collection('users', (ref) => ref.where('email', '==', emailLower))
          .valueChanges();
        this.user.subscribe((user) => {
          //Asign the user to the currentUser variable
          this.myUser = user[0];
          //PatchValue allows to change the value of the form with the values of the user
          this.myForm.patchValue(this.myUser);
          this.getBooks();
          this.spinner.hide();
        });
      }
    });
  }

  myForm: FormGroup = this.fb.group({
    name: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(2)]
    ],
    lastname: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(2)]
    ],
    // The last validator is a asyncValidator
    username: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(5)],
      [this.signUpService.checkUser.bind(this.signUpService)]
    ],
    password: [
      { value: '', disabled: true },
      [Validators.required, Validators.minLength(6)]
    ],
    dni: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(this.dniPattern)]
    ],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(this.emailPattern)]
    ],
    phoneNum: [{ value: '', disabled: true }],
    location: [{ value: '', disabled: true }, [Validators.required]]
  });

  ngOnInit(): void {}

  async getBooks() {
    await this.firestore
      .collection('prestamos', (ref) =>
        ref.where('dniUSer', '==', this.myUser.dni)
      )
      .valueChanges()
      .subscribe((data) => {
        //console.log(data);
        this.myBooks = data;
        //console.log(this.myBooks);
      });
  }

  alertBook(book: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to return the book ${book.title}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#358f80',
      confirmButtonText: 'Yes, return it!'
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(book);

        this.bookService.deleteBook(book);
      }
    });
  }
}
