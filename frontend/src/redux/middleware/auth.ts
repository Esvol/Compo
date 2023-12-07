import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "../services/auth";
export const listenerMiddeware = createListenerMiddleware();

listenerMiddeware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi) => {
        
        if(action.payload.token) {
            localStorage.setItem('token', action.payload.token)
        }
        listenerApi.cancelActiveListeners();
    }
})