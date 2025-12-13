<%@ page contentType="text/html;charset=UTF-8" language="java" %> <%@ taglib uri="http://www.springframework.org/tags"
prefix="spring" %>

    <div class="projects-header">
        <div class="projects-title">
            <span><i class="bi bi-folder2-open"></i></span>
            <span><spring:message code="dashboard" /></span>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card" data-action="showTaskListByFilter" data-filter="all">
            <div class="stat-header">
                <span class="stat-label"><spring:message code="totalProjects" /></span>
                <span class="stat-icon"><i class="bi bi-folder"></i></span>
            </div>
            <div id="total" class="stat-value">12</div>
            <div id="last_total" class="stat-change"><i class="bi bi-arrow-up"></i> 2 <spring:message code="fromLastMonth" /></div>
        </div>

        <div class="stat-card" data-action="showTaskListByFilter" data-filter="in-progress">
            <div class="stat-header">
                <span class="stat-label"><spring:message code="inProgressTasks" /></span>
                <span class="stat-icon"><i class="bi bi-arrow-repeat"></i></span>
            </div>
            <div id="in_progress" class="stat-value">8</div>
            <div id="last_in_progress" class="stat-change"><i class="bi bi-arrow-down"></i> 1 <spring:message code="fromLastWeek" /></div>
        </div>

        <div class="stat-card" data-action="showTaskListByFilter" data-filter="pending">
            <div class="stat-header">
                <span class="stat-label"><spring:message code="weeklyTodo" /></span>
                <span class="stat-icon"><i class="bi bi-hourglass-split"></i></span>
            </div>
            <div id="pending" class="stat-value">3</div>
            <div id="last_pending" class="stat-change"><i class="bi bi-arrow-up"></i> 1 <spring:message code="fromYesterday" /></div>
        </div>

        <div class="stat-card" data-action="showTaskListByFilter" data-filter="overdue">
            <div class="stat-header">
                <span class="stat-label"><spring:message code="overdueTasks" /></span>
                <span class="stat-icon"><i class="bi bi-exclamation-triangle"></i></span>
            </div>
            <div id="overdue" class="stat-value">0</div>
            <div id="last_overdue" class="stat-change"><spring:message code="allOnTrack" /></div>
        </div>
    </div>

    <div class="ppap-section">
        <div class="section-header">
            <span><i class="bi bi-search"></i></span>
            <span><spring:message code="advancedFilter" /></span>
        </div>
        <div class="filter-grid">
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectCustomer" /></label>
                <select class="filter-select" id="sl-customer">
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectModel" /></label>
                <select class="filter-select" id="sl-model">
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="projectNumber" /></label>
                <select class="filter-select" id="pjNum">
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="xvtStage" /></label>
                <select class="filter-select" id="sl-stage">

                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="taskStatus" /></label>
                <select class="filter-select" id="sl-status">

                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="priority" /></label>
                <select class="filter-select" id="sl-priority">

                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="department" /></label>
                <select class="filter-select" id="sl-department">

                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="process" /></label>
                <select class="filter-select" id="sl-process">
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="dri" /></label>
                <select class="filter-select" id="dashboardFilterDRI">
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="deadline" /></label>
                <input type="text" class="filter-input" id="dashboardFilterDeadline" />
            </div>
            <div class="filter-item">
                <label class="filter-label"><spring:message code="searchKeyword" /></label>
                <input type="text" class="filter-input" id="dashboardFilterSearch" placeholder="Search..." />
            </div>
        </div>
        <div class="action-buttons-row d-flex justify-content-end mt-2 gap-3">
            <button class="secondary-btn" id="reset">
                <span><i class="bi bi-arrow-repeat"></i></span>
                <span><spring:message code="reset" /></span>
            </button>
            <button class="primary-btn" id="search">
                <span><i class="bi bi-search"></i></span>
                <span>Search</span>
            </button>
        </div>
    </div>

    <div class="projects-header">
        <div class="projects-title">
            <span><i class="bi bi-building"></i></span>
            <span><spring:message code="projectList" /></span>
        </div>
    </div>

    <div class="projects-grid" id="projectsGrid"></div>

    <div id="cftTeamModal" class="modal fade" tabindex="-1" aria-labelledby="cftTeamModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content modal-content-large">
                <div class="modal-header">
                    <div class="modal-title" id="cftTeamModalLabel">
                        <span><i class="bi bi-people"></i></span>
                        <span id="cftTeamTitle">CFT Team</span>
                    </div>
                    <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="cft-table">
                        <thead>
                            <tr>
                                <th><spring:message code="function" /></th>
                                <th><spring:message code="member" /></th>
                                <th><spring:message code="role" /></th>
                                <th><spring:message code="responsibility" /></th>
                                <th>RACI</th>
                            </tr>
                        </thead>
                        <tbody id="cftTeamBody"></tbody>
                    </table>
                </div>
                <div class="modal-footer bottom-actions justify-content-center mt-0">
                    <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                        <span><i class="bi bi-x-lg"></i></span>
                        <span><spring:message code="close" /></span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div id="taskListModal" class="modal fade" tabindex="-1" aria-labelledby="taskListModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title" id="taskListModalLabel"><spring:message code="taskListTitle" /></div>
                    <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table task-list-table">
                        <thead>
                            <tr>
                                <th><spring:message code="taskID" /></th>
                                <th><spring:message code="taskName" /></th>
                                <th><spring:message code="project" /></th>
                                <th><spring:message code="stage" /></th>
                                <th><spring:message code="status" /></th>
                                <th><spring:message code="priority" /></th>
                                <th><spring:message code="dri" /></th>
                                <th><spring:message code="deadline" /></th>
                                <th><spring:message code="actions" /></th>
                            </tr>
                        </thead>
                        <tbody id="taskListModalBody"></tbody>
                    </table>
                </div>
                <div class="modal-footer bottom-actions mt-0" style="justify-content: center">
                    <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                        <span><i class="bi bi-x-lg"></i></span>
                        <span><spring:message code="close" /></span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div
        id="taskDetailModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="taskDetailModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-xl">
            <div class="modal-content modal-content-large">
                <!-- Modal Header -->
                <div class="modal-header task-detail-header mb-0">
                    <div class="task-detail-title-section">
                        <div class="task-detail-id">PPAP-001</div>
                        <div class="task-detail-name">設計記錄</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px">
                        <div class="task-action-buttons">
                            <button class="task-action-btn follow-btn" data-action="followTask">
                                <span><i class="bi bi-star"></i></span>
                                <span><spring:message code="follow" /></span>
                            </button>
                            <button class="task-action-btn reminder-btn" data-action="setTaskReminder">
                                <span><i class="bi bi-alarm"></i></span>
                                <span><spring:message code="reminder" /></span>
                            </button>
                            <button class="task-action-btn escalation-btn" data-action="escalateTaskIssue">
                                <span><i class="bi bi-bell-fill"></i></span>
                                <span><spring:message code="escalation" /></span>
                            </button>
                            <button class="task-action-btn reassign-btn" data-action="reassignTaskToUser">
                                <span><i class="bi bi-person"></i></span>
                                <span><spring:message code="reassignTask" /></span>
                            </button>
                        </div>
                        <button type="button" class="btn-close close-btn" data-bs-dismiss="modal" aria-label="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="modal-body task-detail-body">
                    <div class="task-main-info">
                        <div class="info-section">
                            <div class="section-title">
                                <span><i class="bi bi-pencil-square"></i></span>
                                <span><spring:message code="taskDescriptionTitle" /></span>
                            </div>
                            <div class="section-content">此任務需要完成相關PPAP文件準備及品質標準</div>
                        </div>

                        <div class="info-section">
                            <div class="section-title">
                                <span><i class="bi bi-paperclip"></i></span>
                                <span><spring:message code="attachments" /></span>
                            </div>
                            <div id="attachments-list" class="attachments-list">
                                <div class="attachment-item">
                                    <div class="attachment-info">
                                        <span class="attachment-icon"><i class="bi bi-file-earmark"></i></span>
                                        <span class="attachment-name">設計規格書_v1.2.pdf</span>
                                    </div>
                                    <button class="download-btn">
                                        <span><i class="bi bi-download"></i> <spring:message code="download" /></span>
                                    </button>
                                </div>
                                <div class="attachment-item">
                                    <div class="attachment-info">
                                        <span class="attachment-icon"><i class="bi bi-bar-chart-line"></i></span>
                                        <span class="attachment-name">FMEA分析表.xlsx</span>
                                    </div>
                                    <button class="download-btn">
                                        <span><i class="bi bi-download"></i> <spring:message code="download" /></span>
                                    </button>
                                </div>
                                <button id="upload" class="add-attachment-btn" data-action="uploadAttachment">
                                    <span><i class="bi bi-paperclip"></i></span>
                                    <span><spring:message code="addAttachment" /></span>
                                </button>
                            </div>
                        </div>

                        <div class="info-section">
                            <div class="section-title">
                                <span><i class="bi bi-chat"></i></span>
                                <span><spring:message code="discussion" /></span>
                            </div>
                            <div class="comments-section">
                                <div class="comment-item">
                                    <div class="comment-header">
                                        <div class="comment-avatar">張</div>
                                        <div>
                                            <div class="comment-author">張工程師</div>
                                            <div class="comment-date">2024-01-16 10:30</div>
                                        </div>
                                    </div>
                                    <div class="comment-text">已完成初步設計檔案準備，待客戶審核。</div>
                                </div>

                                <div class="comment-item">
                                    <div class="comment-header">
                                        <div class="comment-avatar">王</div>
                                        <div>
                                            <div class="comment-author">王品質</div>
                                            <div class="comment-date">2024-01-15 14:45</div>
                                        </div>
                                    </div>
                                    <div class="comment-text">了解，請持續追蹤此問題進度能否在本週完成？</div>
                                </div>

                                <div class="comment-input">
                                    <textarea id="input-comment" class="comment-textarea" placeholder="Enter your comment..."></textarea>
                                    <div class="comment-actions">
                                        <button id="comment" class="submit-comment-btn" data-action="submitComment">Send comment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="task-sidebar">
                        <div class="sidebar-section d-flex flex-column">
                            <span class="sidebar-label">Status</span>
                            <select id="sl-status" class="filter-input "></select>
                        </div>

                        <div class="sidebar-section d-flex flex-column">
                            <span class="sidebar-label">DRI</span>
                            <input id="dri" class="filter-input assignee-name"></input>
                        </div>

                        <div class="sidebar-section d-flex flex-column">
                            <span class="sidebar-label">Priority</span>
                            <select id="sl-priority" class="filter-input "></select>
                        </div>

                        <div class="sidebar-section d-flex flex-column">
                            <span class="sidebar-label"><spring:message code="deadline" /></span>
                            <input id="deadLine" type="text" class="filter-input" />
                        </div>

                        <div class="sidebar-section d-flex flex-column">
                            <span class="sidebar-label"><spring:message code="xvtStage" /></span>
                            <select id="sl-xvt" class="filter-input "></select>
                        </div>

                        <div class="sidebar-section">
                            <div class="sidebar-label"><spring:message code="taskType" /></div>
                            <div class="sidebar-value">Design</div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer bottom-actions mt-0">
                    <button type="button" class="secondary-btn" data-bs-dismiss="modal">
                        <span><i class="bi bi-door-open"></i></span>
                        <span><spring:message code="close" /></span>
                    </button>
                    <button type="button" class="primary-btn" data-action="saveTaskChanges">
                        <span><i class="bi bi-floppy"></i></span>
                        <span><spring:message code="saveChanges" /></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
<script src="/sample-system/js/modules/dashboard.js"></script>
