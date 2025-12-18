import { getAllUsers, updateUserRole, updateUser, deleteUser, findUserById } from '../models/user.model.js';

/**
 * 모든 사용자 조회 (관리자)
 */
export async function getUsersController(req, res) {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 목록 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 사용자 역할 변경 (관리자)
 */
export async function updateUserRoleController(req, res) {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    // 본인의 역할은 변경할 수 없음
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '본인의 관리자 권한은 변경할 수 없습니다.'
      });
    }

    // 사용자 존재 확인
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    const updatedUser = await updateUserRole(id, isAdmin);

    res.status(200).json({
      success: true,
      message: '사용자 역할이 변경되었습니다.',
      data: updatedUser
    });
  } catch (error) {
    console.error('사용자 역할 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 역할 변경 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 사용자 정보 수정 (관리자)
 */
export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: '이름과 이메일은 필수입니다.'
      });
    }

    // 사용자 존재 확인
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    const updatedUser = await updateUser(id, { name, email });

    res.status(200).json({
      success: true,
      message: '사용자 정보가 수정되었습니다.',
      data: updatedUser
    });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 정보 수정 중 오류가 발생했습니다.'
    });
  }
}

/**
 * 사용자 삭제 (관리자)
 */
export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    // 본인은 삭제할 수 없음
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '본인 계정은 삭제할 수 없습니다.'
      });
    }

    // 사용자 존재 확인
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    await deleteUser(id);

    res.status(200).json({
      success: true,
      message: '사용자가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 삭제 중 오류가 발생했습니다.'
    });
  }
}

export default {
  getUsersController,
  updateUserRoleController,
  updateUserController,
  deleteUserController
};
