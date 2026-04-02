import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  console.log('Interceptor a examinar URL:', req.url);

  const isApiUrl = req.url.includes('localhost:3000');

  if (token && isApiUrl) {
    console.log('Token anexado com sucesso para:', req.url);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  //if (!token) console.warn('Atenção: Nenhum token encontrado no localStorage!');
  return next(req);
};
