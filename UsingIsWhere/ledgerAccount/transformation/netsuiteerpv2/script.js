if (isWhere) {
    const queries = originalObject.where.map(q => {
        if (q.attribute == 'account_type') q.attribute = 'type';
        return q;
    });
    transformedObject.where = queries;
}

done(transformedObject);