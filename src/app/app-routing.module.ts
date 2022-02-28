import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/register-login/register-login.module').then(m => m.RegisterLoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/main-app/books.module').then(m => m.BooksModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
