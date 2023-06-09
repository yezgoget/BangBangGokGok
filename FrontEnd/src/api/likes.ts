import instance from "./api";

export async function postInterest(themeId: number) {
  return await instance.post(`/interest/${themeId}`);
}
export async function deleteInterest(themeId: number) {
  return await instance.delete(`/interest/${themeId}`);
}
export async function getIsLiked(themeId: number) {
  return await instance.get(`/interest/${themeId}`);
}
