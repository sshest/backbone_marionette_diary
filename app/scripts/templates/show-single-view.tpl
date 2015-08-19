    <!--шаблон для представления содержимого отдельной записи(модели события)-->
<script type="text/template" id="show">
    <div class="row">
        <div class="span12">
            <div class="row w-title-h">
                <h1 class="title-h"></h1>
            </div>
            <div class="row">
                <div class="container">
                    <div class="pull-right" id='issueDate'><p>Дата:</p><%= date %></div>
                </div>
                <div class="container">
                    <div id='issueDescription'><%= issueDescription %></div>
                </div>
                <div class="container video">
                    <div id='issueVideo'></div>
                </div>
                <div class="container map">
                    <div id='issuePlace'></div>
                </div>

            </div>
        </div>
     </div> 
</script>
