// login.test.js

const request = require('supertest');
const app = require('../server'); // Importa la aplicación del servidor

// login.test.js

test('Inicio de sesión exitoso', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'admin@gmail.com', password: '1234' });

  
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user');
  });
  
  test('Inicio de sesión fallido', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'usuario@example.com', password: 'contraseñaIncorrecta' });
  
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('Renderizar dashboard si el usuario está autenticado', async () => {
    // Simular inicio de sesión exitoso y obtener una cookie de sesión
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'admin@gmail.com', password: '1234' });
  
    // Hacer una solicitud GET a la ruta del dashboard
    const response = await request(app)
      .get('/dashboard')
      .set('Cookie', loginResponse.headers['set-cookie']);
  
    // Verificar el código de respuesta y el contenido renderizado
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Dashboard'); // Verifica que el texto 'Dashboard' está presente en la respuesta
  });
  
  test('Redirigir a la página de inicio de sesión si el usuario no está autenticado', async () => {
    // Hacer una solicitud GET a la ruta del dashboard sin una cookie de sesión
    const response = await request(app)
      .get('/dashboard');
  
    // Verificar que la respuesta redirige a la página de inicio de sesión
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login'); // Verifica que la ubicación de redirección es '/login'
  });