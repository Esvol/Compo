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