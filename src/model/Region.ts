/**
 * 地区
 */
type RegionType = {
    id: bigint,
    label: string,
    code: bigint,
    parentId: bigint,
    levelId: string,
    children?: RegionType[]
}

export default RegionType;

