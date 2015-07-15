<div class="row">
    <div class="span12">
        <div class="row w-title-h">
            <h1 class="title-h"></h1>
        </div>
        <div class="row">
            <form class="form-horizontal">
                <div class="control-group">
                    <label class="control-label" for="inputTitle">Название события</label>
                    <div class="controls">
                        <input type="text" name="title" id="inputTitle" placeholder="Название" value="<%- title %>">
                        <span class="help-inline"></span>
                    </div>
                </div>
                 <div class="control-group">
                    <label class="control-label" for="inputDescription">Описание</label>
                    <div class="controls">
                        <textarea id="inputDescription" placeholder="Тут будут Ваши мысли об этом событии..."  cols='40' rows='7'><%- description %></textarea> 
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="selectAttitude">Отношение к событию</label>
                    <div class="controls">
                        <select id="selectAttitude" size="1"> 
                            <option value="positive">Положительное</option>
                            <option value="neutral">Нейтральное</option>
                            <option value="negative">Отрицательное</option>
                        </select>
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="inputDate">Дата</label>
                    <div class="controls">
                        <input type="date" name="date" id="inputDate" placeholder="--.--.----" value="<%- date %>">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="inputVideo">Прикрепить YouTube-видео</label>          
                    <div class="controls">
                        <input type="text" id="inputVideo" placeholder="Введите Id Youtube видео" value="<%- videoId %>">
                    </div>
                    <div id="video-thumbnail"></div> 
                </div>

                <div class="control-group">
                    <label class="control-label" for="map">Выбрать место на карте</label>
                        <div class="controls">
                            <div id='map'></div> 
                            <input name="coords" id="markerCoords" type="hidden">
                        </div>
                </div>

                <div class="row">
                    <div class="span6">
                        <div class="control-group">
                            <div class="controls">
                                <button class="btn btn-info btn-block" href="#"><i class="fa fa-save" ></i>Сохранить событие</button> 
                            </div>
                        </div>
                    </div>
                </div>



            </form>
        </div>
    </div>
 </div>	