import { ProjectInput } from "../../pages/user/AddProject";
import { Project, SingleProject } from "../slices/project";
import { api } from "./api";


export const projectApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllProjects: builder.query<[Project], void>({
            query: () => ({
                url: '/dashboard/projects',
                method: 'GET'
            }),
            providesTags: (result) =>
                result 
                    ?   [
                            ...result.map(({ _id }) => ({ type: 'Projects' as const, _id })), 
                            { type: 'Projects', id: 'ADD-PROJECT' },
                            {type: 'Projects', id: 'DELETE-PROJECT'}
                        ] 
                    :   [{ type: 'Projects', id: 'ADD-PROJECT' }],
        }),
        getOneProject: builder.query<SingleProject, string>({
            query: (id) => ({
                url:`/dashboard/projects/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'SingleProject', id }],
        }),
        createProject: builder.mutation<Project, ProjectInput>({
            query: (projectData) => ({
                url: '/user/create-project',
                method: 'POST',
                body: projectData,
            }),
            invalidatesTags: [{ type: 'Projects', id: 'ADD-PROJECT' }],
        }),
        updateProject: builder.mutation<Project, ProjectInput & {id: string}>({
            query: (projectData) => ({
                url: `/user/projects/${projectData.id}`,
                method: 'PATCH',
                body: projectData,
            }),
            invalidatesTags: (result, error, projectData) => [{type: 'Projects', id: projectData.id}]
        }),
        deleteProject: builder.mutation<Project, string>({
            query: (id) => ({
                url: `/user/projects/${id}`,
                method: 'DELETE',
                body: id,
            }),
            invalidatesTags: [{type: 'Projects', id: 'DELETE-PROJECT'}],
        })
    })
}) 

export const 
{   
    useGetAllProjectsQuery, 
    useGetOneProjectQuery, 
    useCreateProjectMutation,
    useUpdateProjectMutation, 
    useDeleteProjectMutation,

} = projectApi

export const 
{endpoints: 
    {   
        getAllProjects, 
        getOneProject, 
        createProject, 
        updateProject, 
        deleteProject, 
    } 
} = projectApi