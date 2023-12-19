import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ErrorDataType = {
    error: Object,
    message: string,
}

export const FormatDate = (date: string) => {
    const inputDate = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(inputDate);

    return formattedDate;
}

export const catchFetchError = (error: FetchBaseQueryError | SerializedError | undefined) => {
    console.log(error);
    
    if (error !== undefined && 'status' in error){
        const errorData = (error.data as ErrorDataType | null);
        return errorData ? errorData.message : 'No message'
    } 
    else {
        return error?.message || 'no message'
    }
}

// export const stageClass = (stage: string) => {
//     const stageCl = 
//     stage === 'Beginner'
//   ? styles.beginner
//   : stage === 'Mid-development'
//   ? styles.middle
//   : stage === 'Almost finished'
//   ? styles.almost_finished
//   : stage === 'Testing'
//   ? styles.testing
//   : stage === 'Maintenance'
//   ? styles.maintenance
//   : '';