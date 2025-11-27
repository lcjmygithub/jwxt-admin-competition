/*
 * @Author: lcj
 * @Date: 2025-04-16 16:04:51
 * @LastEditTime: 2025-11-18 18:50:40
 * @LastEditors: lcj
 * @Description:
 */
import { request } from "@/utils/request";

export default class HomeAPI {
  // 获取专家评审赛制
  static getCompetitionPage(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/get-competition-page`,
      method: "get",
      params: queryParams,
    });
  }

  // 获取专家评审统计数据
  static getCompetitionCount(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/get-competition-count`,
      method: "get",
      params: queryParams,
    });
  }

  //获取专家评审作品分页列表

  static getCompetitionWorkPage(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/get-competition-work-page`,
      method: "get",
      params: queryParams,
    });
  }

  //获取专家评审作品详情
  static getVoteWorkDetail(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/get-detail`,
      method: "get",
      params: queryParams,
    });
  }

  //专家评审作品
  static reviewWorkScore(data: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/review-work-score`,
      method: "post",
      data: data,
    });
  }

  // 获取全部待评审列表
  static getReviewList(queryParams: any) {
    return request({
      url: `/platform-api/activity/vote-work-specialist-score/get-all-review-list`,
      method: "get",
      params: queryParams,
    });
  }
}
