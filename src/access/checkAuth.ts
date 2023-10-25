/**
 * 公用权限校验
 */

import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查当前登录用户的携带的权限
 * @param loginUser 当前登录的用户
 * @param needAccess 需要的权限
 */
const checkAuth = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前登录用户具有的权限（如果没有 loginUser，则表示未登录）
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // 如果用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  //需要UP主登入访问
  if (needAccess === ACCESS_ENUM.UP_USER) {
    if (loginUserAccess !== ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  // 需要管理员登入访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAuth;
