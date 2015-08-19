    <!--шаблон для базового представления редактирования/создания записи о событии-->
<script type="text/template" id="edit">
    <div class="row">
        <div class="span12">
            <div class="row w-title-h">
                <h1 class="title-h"></h1>
            </div>
            <div class="row">
                <form class="form-horizontal">
                    <div class="control-group">
                        <label class="control-label" for="issueTitle">Название события</label>
                        <div class="controls">
                            <input type="text" name="issueTitle" id="issueTitle" value="<%= issueTitle %>">
                            <span class="help-inline"></span>
                        </div>
                    </div>
                     <div class="control-group">
                        <label class="control-label" for="issueDescription">Описание</label>
                        <div class="controls">
                            <div id='editorPalette'>
                                <div class="palette-wrapper">
                                    <label><input type="checkbox" name="i" value="italic">Курсив</label>
                                    <label><input type="checkbox" name="b" value="bold">Жирный</label>
                                    <label><input type="checkbox" name="u" value="underline">Подчеркивание</label>|
                                </div>
                                <div class='palette-wrapper' id='colwrapper'>
                                    <label class="palette-label">Цвет текста</label>
                                    <div id='colpalette' class='hidden'>
                                        <label><input type='radio' name='color' value="red">Красный</label> 
                                        <label><input type='radio' name='color' value="yellow">Желтый</label>
                                        <label><input type='radio' name='color' value="green">Зеленый</label>
                                        <label><input type='radio' name='color' value="blue">Синий</label>
                                        <label><input type='radio' name='color' value="brown">Коричневый</label>
                                        <label><input type='radio' name='color' value="black">Черный</label>
                                    </div>
                                    
                                |</div>
                                <div class="palette-wrapper">
                                    <label>Размер шрифта<select id='font-size'>
                                        <option value='1'>10</option>
                                        <option value='2'>12</option>
                                        <option value='3' selected>14</option>
                                        <option value='4'>16</option>
                                    </select></label>
                                </div>
                            </div>
                            <iframe id="description" cols='80' rows='7'><%= issueDescription %></iframe>
                            <span class="help-inline"></span>
                            <input name="issueDescription" id="issueDescription" class="hidden"> 
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="selectAttitude">Отношение к событию</label>
                        <div class="controls">
                            <select id="selectAttitude" name= "selectAttitude" size="1"> 
                                <option value="positive">Положительное</option>
                                <option value="neutral">Нейтральное</option>
                                <option value="negative">Отрицательное</option>
                            </select>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="date">Дата</label>
                        <div class="controls">
                            <input type="date" name="date" id="date" value="<%= date %>">
                            <span class="help-inline"></span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="videoUrl">Прикрепить YouTube-видео</label>          
                        <div class="controls">
                            <input type="url" name="videoUrl" id="videoUrl" placeholder="Введите Url Youtube видео" value="<%= videoUrl %>">
                            <span class="help-inline"></span>
                            <div id='vPlayer'></div>
                            <div id='videoThumbnail'><img src="" alt="Невозможно отобразить превью"></div>
                        </div>
                        
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="map">Выбрать место на карте (по адресу или кликом по карте)</label>
                        <div class="controls">
                            <input id="adress-input" type="text" placeholder="Введите адрес здесь">
                            <div id='map'></div> 
                            <input name="coords" id="markerCoords" type="hidden">
                        </div>
                    </div>

                    <div class="row">
                        <div class="span4">
                            <div class="control-group">
                                <div class="controls">
                                    <button type="submit" class="btn btn-info btn-block" href="#"><i class="fa fa-save" ></i>Сохранить событие</button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
     </div> 
</script>
