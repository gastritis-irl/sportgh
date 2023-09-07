import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'sgh-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnDestroy {

    @ViewChild('loginContent') loginContent!: TemplateRef<string>;

    loggedInUserEmail: string | null = null;
    loggedInUserName: string | null = null;
    showDropdown: boolean = false;


    email: string = '';
    password: string = '';

    private ngUnsubscribe = new Subject<void>();

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
        private router: Router,
        private afAuth: AngularFireAuth,
        private toastNotify: ToastrService,
    ) { }

    logout(): void {
        this.afAuth.signOut().then(() => {
            this.loggedInUserEmail = null;  // Reset the logged-in email
            this.loggedInUserName = null;  // Reset the logged-in name
            //delete the user from the local storage and the firebasetoken from the session storage
            localStorage.removeItem('user');
            sessionStorage.removeItem('firebaseToken');
            this.toastNotify.success('Successfully logged out');
        }).catch(error => {
            console.error('Error during logout', error);
            this.toastNotify.warning('Error logging out');
        });
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    ngOnInit(): void {
        this.afAuth.authState
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(user => {
                if (user) {
                    this.loggedInUserEmail = user.email;
                    this.loggedInUserName = user.email; 
                } else {
                    this.loggedInUserEmail = null;
                    this.loggedInUserName = null;
                }
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.ngUnsubscribe.pipe(takeUntil(this.ngUnsubscribe));
        this.closeModal(); // Close any open modal
    }

    openModal(content: TemplateRef<string>): void {
        this.closeModal(); // Close any open modal
        this.modalService.open(content, { centered: true, scrollable: true, animation: true });
    }

    closeModal(): void {
        this.modalService.dismissAll();

        // Clear the form
        this.email = '';
        this.password = '';
    }

    login(): void {
        this.userService.signinWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: () => {
                    // Use the email directly here before clearing the form
                    this.loggedInUserEmail = this.email;

                    this.toastNotify.success(`Successfully logged in as ${this.email}`);
                    this.closeModal(); // Close the modal
                    },
                error: (error): void => {
                    console.log(error);
                    this.toastNotify.warning(`Error logging in`);
                }
            });
        }).catch(error => {
            console.log(error);
            this.toastNotify.warning(`Error logging in`);
        });
    }

    register(): void {
        this.userService.registerWithFirebase(this.email, this.password).then(userObservable => {
            userObservable.subscribe({
                next: () => {

                    // Use the email directly here before clearing the form
                    this.loggedInUserEmail = this.email;

                    
                    this.toastNotify.success('Registration successful');
                    this.closeModal(); // Close the modal
                },
                error: (error): void => {
                    console.log(error);
                    this.toastNotify.warning(`Error registering`);
                }
            });
        }).catch(error => {
            console.log(error);
            this.toastNotify.warning(`Error registering`);
        });
    }

}
