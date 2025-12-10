/**
 * 관리자 권한 체크 미들웨어
 * authenticateToken 미들웨어 이후에 사용해야 함
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }

  next();
}

export default {
  requireAdmin
};
