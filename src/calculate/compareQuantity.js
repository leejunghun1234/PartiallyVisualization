export function compareQuantity(timeInfo0, timeInfoCopy) {
    const compare = {
        "Walls": {},
        "Curtain Walls": {},
        "Floors": {},
        "Ceilings": {},
        "Columns": {},
        "Structural Columns": {},
        "Stairs": {},
        "Railings": {},
        "Windows": {},
        "Doors": {},
    };
    Object.keys(compare).forEach(category => {
        const originCategoryInfo = timeInfo0[category] || {}; // ✅ timeInfo0의 해당 카테고리 데이터 가져오기 (없으면 빈 객체)
        const originCategoryKeys = Object.keys(originCategoryInfo);
    
        const afterCategoryInfo = timeInfoCopy[category] || {}; // ✅ timeInfoCopy의 해당 카테고리 데이터 가져오기 (없으면 빈 객체)
        const afterCategoryKeys = Object.keys(afterCategoryInfo);
    
        afterCategoryKeys.forEach(i => {
            let presentInfo = originCategoryKeys.includes(i) ? timeInfoCopy[category][i] : 0;
            const difference = presentInfo - (timeInfo0[category][i] || 0); // ✅ 초기 데이터가 없을 경우 기본값 0
            compare[category][i] = difference;
        });
    });
    return compare;
}