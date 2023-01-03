/**
 * 组织用户
 */
type OriginUserType = {
    id:bigint,
    oid:bigint,
    uid:bigint,
    createTime:string,
    originInfo:OriginInfo[],
    userInfo:userInfo[]
}

type OriginInfo={
    rid:bigint,
    originName:string,
    originAvatar:string,
    originCreateId:bigint,
    originRegionName:string
}

type userInfo={
    userId:bigint,
    userName:string,
    regionId:bigint,
    regionName:string,
    userAvatar:string,
    userSign:string,
    mobile:string,
    email:string,
    joinTime:string
}

export default OriginUserType;

