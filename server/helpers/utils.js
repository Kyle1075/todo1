//utils.js
const emptyOrRows = (result) => {
    if (!result) return [];
    return result.rows;
}

export{ emptyOrRows };
