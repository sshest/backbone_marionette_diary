<!--шаблон для отображения одной записи в таблице-->
    <script type="text/template" id="issue">
    	<td class="date"><%= date %></td>
		<td class="title"><%= issueTitle %></td>
		<td class="attitude"><%if (attitude==='positive') {%>Положительное<%}
							   else if (attitude==='neutral') {%>Нейтральное<%}
									else {%>Отрицательное<%}%></td>
		<td style="text-align:  center;">
			<button class="btn btn-info edit" href="#"><i class="fa fa-edit"></i></button>
			<button class="btn btn-danger remove" href="#"><i class="fa fa-remove"></i></button>
		</td>
    </script>