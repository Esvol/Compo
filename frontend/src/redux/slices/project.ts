import { createSlice } from "@reduxjs/toolkit"
import { projectApi } from "../services/project"
import { commentApi } from "../services/comment"
import { UserType } from "./auth"

export type Comment = {
    _id: string,
    projectId: string,
    vacancyId?: string,
    user: UserType,
    createdAt: string,
    updatedAt: string,
    text: string,
}

export type Project = {
    _id: string,
    title: string,
    idea: string,
    text: string,
    projectTeam: UserType[],
    tags: string[],
    stage: 'Beginner' | 'Mid-development' | 'Almost finished' | 'Testing' | 'Maintenance',
    price: number,
    contact: string | '',
    preorder: boolean,
    viewCount: number,
    imageURL: string | '',
    user: UserType,
    comments: string[] | Comment[],
    createdAt: string,
    updatedAt: string,
}

export type SingleProject = Omit<Project, 'comments'> & {
    comments: {
        projectId: string,
        text: string,
        _id: string,
        user: UserType,
        createdAt: string,
        updatedAt: string,
    }[]
}

type InitialState = {
    currentProject: SingleProject | null,
    currentProjectStatus: 'loading' | 'success' | 'rejected',
    projects: Project[],
    projectsStatus: 'loading' | 'success' | 'rejected',
}

const initialState: InitialState = {
    currentProject: null,
    currentProjectStatus: 'loading',
    projects: [],
    projectsStatus: 'loading',
}

export const projectSlice = createSlice({
    name: 'projectSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(projectApi.endpoints.getAllProjects.matchFulfilled, (state, action) => {
                state.projects = action.payload;
                state.projectsStatus = 'success';
            })
            .addMatcher(projectApi.endpoints.getOneProject.matchFulfilled, (state, action) => {
                state.currentProject = action.payload;
                state.currentProjectStatus = 'success';
            })
            .addMatcher(projectApi.endpoints.addProject.matchFulfilled, (state, action) => {
                if (state.projects && action.payload) {
                    state.projects = [...state.projects, action.payload];
                    state.projectsStatus = 'success';
                }
            })
            .addMatcher(projectApi.endpoints.updateProject.matchFulfilled, (state, action) => {
                if(state.projects && action.payload){
                    state.projects = state.projects.map(project => {
                        if(project._id === action.payload._id){
                            project = action.payload;
                        }
                        return project;
                    })
                }
            })

            .addMatcher(commentApi.endpoints.createComment.matchFulfilled, (state, action) => {
                if (state.currentProject && action.payload) {
                    state.currentProject.comments = [...state.currentProject.comments, action.payload];
                }
            })
            .addMatcher(commentApi.endpoints.deleteComment.matchFulfilled, (state, action) => {
                if(state.currentProject && action.payload){
                    state.currentProject.comments = state.currentProject.comments.filter(comment => comment._id !== action.payload._id)
                }
            })
    }
})


export default projectSlice.reducer