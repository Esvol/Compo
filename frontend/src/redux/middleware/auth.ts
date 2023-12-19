import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "../services/auth";
export const listenerLoginMiddeware = createListenerMiddleware();
export const listenerRegisterMiddeware = createListenerMiddleware();

listenerLoginMiddeware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        
        if(action.payload.token) {
            localStorage.setItem('token', action.payload.token)
        }
        listenerApi.cancelActiveListeners();
    }
})

listenerRegisterMiddeware.startListening({
    matcher: authApi.endpoints.register.matchFulfilled,
    effect: async (action, listenerApi) => {

        if(action.payload.token) {
            localStorage.setItem('token', action.payload.token)
        }
        listenerApi.cancelActiveListeners();
    }
})
