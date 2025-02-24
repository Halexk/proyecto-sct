import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
    let service: AuthGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthGuard, AuthService]
        });
        service = TestBed.inject(AuthGuard);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});