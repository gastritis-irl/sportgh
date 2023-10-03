import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../../shared/image/image.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { ImageComponent } from '../../shared/image/image.component';
import { Image } from '../../shared/image/image.model';

@Component({
    selector: 'sgh-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    @ViewChild(ImageComponent, {static: false}) imageComponent?: ImageComponent;

    username: string = '';
    user: User = {
        id: undefined,
        username: '',
        email: '',
        phoneNumber: '',
        address: '',
        imageId: 0,
        imageDataUrl: undefined
    };
    newImageFile?: File;
    mode: 'edit' | 'create' = 'edit';

    constructor(
        private userService: UserService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData(params['uid']);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    cancelEdit(route: string): void {
        this.router.navigate([route])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }

    loadData(uid: string | undefined): void {
        if (uid) {
            this.userService.getByUid(uid).subscribe({
                next: (data: User): void => {
                    this.user = data;
                },
                error: (): void => {
                    this.toastNotify.error(`Error fetching data`);
                }
            });
        }
    }

    onFileChange(files: File[]): void {
        if (files.length > 0) {
            this.newImageFile = files[0];
        }
    }

    updateUser(): void {
        if (!this.user.id) {
            this.toastNotify.warning('User not found');
            return;
        }

        if (this.newImageFile) {
            this.imageService.uploadImage(this.newImageFile).subscribe(
                {
                    next: (image: Image): void => {
                        if (image.id) {
                            this.user.imageId = image.id;
                        }
                        this.updateUserData();
                    },
                    error: (error): void => {
                        this.toastNotify.error(`Error uploading new image ${error.error}`);
                    }
                }
            );
        } else {
            this.updateUserData();
        }
    }

    updateUserData(): void {
        if (this.user.id) {
            this.userService.update(this.user.id, this.user).subscribe(() => {
                this.toastNotify.success('User updated successfully');
            });
        }
    }

    onSubmit(): void {
        this.updateUser();
        this.router.navigate(['/users', this.user.firebaseUid])
            .catch((error): void => {
                console.error(error);
                this.toastNotify.error('Error redirecting to page');
            });
    }
}