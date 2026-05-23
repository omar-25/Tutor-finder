package com.omar.yaladars.auth;

public interface IAuth {
    AuthResponse register(Register request);
    AuthResponse login(Login request);
}