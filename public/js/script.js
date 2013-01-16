$(document).ready(function() {
	$.fn.editable.defaults.mode = 'inline';
	body_id = $('body').attr('id');

	if (body_id == 'dashboard') {
		$('.chart').easyPieChart({
			barColor: function(percent) {
				percent /= 100;
				return "rgb(" + Math.round(255 * (1-percent)) + ", " + Math.round(255 * percent) + ", 0)";
			},
			trackColor: '#5c5c5c',
			scaleColor: false,
			lineCap: 'butt',
			lineWidth: 15,
			animate: 2000
		});

		var ajax_call = function() {
			$.getJSON('/ProjectManager/ajax/dashboard', function(data) {
				$('#openTasksCount').html(data.openTasksCount);
				$('#allTasksCount').html(data.allTasksCount);
				$('#userTodaysProductivityText').html(data.userTodaysProductivity);
				$('#userTodaysTime').html(data.userTodaysTime);
				$('#userMonthsTime').html(data.userMonthsTime);
				$('#header-notification').html(data.notificationsHtml);

				$('#taskPercent').data('easyPieChart').update(data.taskPercent);
				$('#userTodaysProductivity').data('easyPieChart').update(data.userTodaysProductivity);
				$('#userTodaysTimePercent').data('easyPieChart').update(data.userTodaysTimePercent);
				$('#userMonthsTimePercent').data('easyPieChart').update(data.userMonthsTimePercent);

				$(".date").easydate({ 'live': false });
				$(".date").show();
			});
		};

		setInterval(ajax_call, 5 * 1000);
	}
	else if (body_id == 'project_tasks') {
		$('#task_title').editable();
		$('#task_job_id').editable();
		$('#task_hours').editable();
		$('#task_assigned_to').editable();
		$('#task_status').editable();
		$('.comment_content').editable();
		$('#comment-textarea').wysihtml5();

		$('.comment-edit').click(function(e) {
			e.stopPropagation();
			e.preventDefault();
			$("#" + $(this).attr("data-id")).editable('toggle');
		});

		$('#post-comment').click(function(e) {
			e.stopPropagation();
			e.preventDefault();

			$(this).attr('disabled', 'disabled');

			$.ajax({
				type: "POST",
				url: $(this).attr("data-url"),
				dataType: "json",
				data: {
					task_id: $('#comment-form-task-id').val(),
					comment: $('#comment-textarea').val()
				}
			}).done(function(data) {
				if (data.success) {
					$('#comment-form').each (function() {
						this.reset();
					});

					$('#comment_block').append(data.comment_html);
					$(".date").easydate({ 'live': false });
					$(".date").show();
					$(data.comment_html_id).editable();

					$('.comment-edit').click(function(e) {
						e.stopPropagation();
						e.preventDefault();
						$("#" + $(this).attr("data-id")).editable('toggle');
					});
				}
			});

			$(this).removeAttr('disabled');
		});

		var ajax_call_project_tasks = function() {
			$.getJSON('/ProjectManager/ajax/projecttasks', function(data) {
				$('#header-notification').html(data.notificationsHtml);

				$(".date").easydate({ 'live': false });
				$(".date").show();
			});
		};

		setInterval(ajax_call_project_tasks, 5 * 1000);
	}

	$(".date").easydate({ 'live': false });
	$(".date").show();
});
