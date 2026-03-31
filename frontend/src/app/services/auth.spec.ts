import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // Necessário para o inject(HttpClient)
import { AuthService } from './auth'; // Garantir que o nome bate com o export do teu service

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient() // Adicionamos isto para o teste não crashar ao ver o HttpClient
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
