import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MenuItemComponent } from '../menu/menu-item/menu-item.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenuComponent, MenuItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarLayout {
  private readonly authService = inject(AuthService);

  readonly user$ = this.authService.user$;

  getInitial(username: string): string {
    return username?.charAt(0).toUpperCase() || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
