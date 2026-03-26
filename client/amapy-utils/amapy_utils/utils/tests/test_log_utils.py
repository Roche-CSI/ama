from unittest.mock import patch

import colorama
import pytest

from amapy_utils.utils.log_utils import (LogData, colored_string, colorize, UserLog, LogColors,
                                         kilo_byte, comma_formatted, format_link, bold_string,
                                         _boxed_message, _visual_width, _visual_center,
                                         _user_log_title, disable_user_log)


def test_log_data_add():
    log_data = LogData()
    log_data.data.clear()
    message = "Test message"
    color = LogColors.INFO
    log_data.add(message, color)
    assert len(log_data.data) == 1
    assert log_data.data[0] == {"message": message, "color": color}


def test_log_data_print_format():
    log_data = LogData()
    log_data.data.clear()
    messages = [("First message", LogColors.ERROR), ("Second message", None)]
    expected_output = ""
    for message, color in messages:
        log_data.add(message, color)
        expected_output += f"{colored_string(message, color)}\n" if color else f"{message}\n"
    assert log_data.print_format().strip() == expected_output.strip()


def test_log_data_print_format_empty():
    log_data = LogData()
    log_data.data.clear()
    assert log_data.print_format() is None


def test_colorize_with_style():
    message = "Test message"
    color = LogColors.ERROR
    expected_result = f"{colorama.Style.BRIGHT}{color}{message}{colorama.Style.RESET_ALL}"
    assert colorize(message, color=color, style="bold") == expected_result


def test_colorize_no_color():
    assert colorize("plain text") == "plain text"
    assert colorize("plain text", color=None) == "plain text"


def test_colorize_dim_style():
    result = colorize("dim text", color=LogColors.INFO, style="dim")
    assert colorama.Style.DIM in result
    assert "dim text" in result


def test_colorize_no_style():
    result = colorize("styled", color=LogColors.SUCCESS)
    assert "styled" in result
    assert colorama.Style.RESET_ALL in result


def test_colored_string_with_color():
    result = colored_string("hello", color=LogColors.INFO)
    assert LogColors.INFO in result
    assert "hello" in result


def test_colored_string_no_color():
    result = colored_string("hello", color=None)
    assert "hello" in result


def test_bold_string():
    result = bold_string("bold text")
    assert "bold text" in result


def test_format_link():
    result = format_link("https://example.com")
    assert "https://example.com" in result
    assert colorama.Fore.CYAN in result


def test_user_log_title():
    result = _user_log_title("My Title")
    assert "My Title" in result
    assert colorama.Fore.LIGHTRED_EX in result


def test_visual_width():
    assert _visual_width("hello") == 5


def test_visual_center():
    result = _visual_center("hi", 10)
    assert "hi" in result
    assert len(result) == 10


def test_boxed_message():
    result = _boxed_message("Hello World")
    assert "+" in result
    assert "-" in result
    assert "|" in result
    assert "Hello World" in result


def test_boxed_message_with_color():
    result = _boxed_message("Colored Box", border_color=LogColors.INFO)
    assert "Colored Box" in result


def test_boxed_message_multiline():
    result = _boxed_message("Line 1\nLine 2")
    assert "Line 1" in result
    assert "Line 2" in result


def test_user_log_colors():
    assert UserLog().colors is LogColors


def test_user_log_error(capsys):
    UserLog().error("something broke")
    assert "something broke" in capsys.readouterr().out


def test_user_log_info(capsys):
    UserLog().info("info message")
    assert "info message" in capsys.readouterr().out


def test_user_log_alert(capsys):
    UserLog().alert("alert message")
    assert "alert message" in capsys.readouterr().out


def test_user_log_success(capsys):
    UserLog().success("success message")
    assert "success message" in capsys.readouterr().out


def test_user_log_colorize():
    result = UserLog().colorize("text", LogColors.ERROR)
    assert "text" in result
    assert LogColors.ERROR in result


def test_user_log_message_with_title(capsys):
    UserLog().message("body text", title="Title")
    captured = capsys.readouterr()
    assert "Title" in captured.out
    assert "body text" in captured.out


def test_user_log_message_bulleted(capsys):
    UserLog().message(["item1", "item2"], bulleted=True)
    captured = capsys.readouterr()
    assert "- item1" in captured.out
    assert "- item2" in captured.out


def test_user_log_message_unformatted(capsys):
    UserLog().message("raw text", formatted=False)
    assert "raw text" in capsys.readouterr().out


def test_user_log_message_unformatted_with_color_raises():
    with pytest.raises(Exception, match="color, title and bulleted can only be used with formatted=True"):
        UserLog().message("text", color=LogColors.INFO, formatted=False)


def test_user_log_indented_message_with_title(capsys):
    UserLog().indented_message("indented body", title="Indent Title")
    captured = capsys.readouterr()
    assert "Indent Title" in captured.out
    assert "indented body" in captured.out


def test_user_log_indented_message_no_title(capsys):
    UserLog().indented_message("just body", color=LogColors.INFO)
    assert "just body" in capsys.readouterr().out


@patch("builtins.input", side_effect=Exception("input error"))
def test_user_log_get_input_exception(mock_input, capsys):
    result = UserLog()._get_input(prompt="test: ", default="fallback")
    assert result == "fallback"


def test_user_log_table(capsys):
    columns = {"name": "Name", "age": "Age"}
    rows = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
    UserLog().table(columns=columns, rows=rows)
    captured = capsys.readouterr()
    assert "Alice" in captured.out
    assert "Bob" in captured.out


def test_user_log_table_formatted():
    columns = {"name": "Name", "value": "Value"}
    rows = [{"name": "key1", "value": "val1"}]
    result = UserLog().table_formatted(columns=columns, rows=rows)
    assert "Name" in result
    assert "key1" in result


def test_user_log_table_formatted_with_col_align():
    columns = {"name": "Name", "value": "Value"}
    rows = [{"name": "key1", "value": "val1"}]
    result = UserLog().table_formatted(columns=columns, rows=rows, col_align=["right", "center"])
    assert "Name" in result


def test_user_log_table_formatted_with_indent():
    columns = {"name": "Name"}
    rows = [{"name": "item"}]
    result = UserLog().table_formatted(columns=columns, rows=rows, indent=2)
    assert "\t\t" in result


def test_user_log_table_with_objects():
    class Row:
        def __init__(self, name, val):
            self.name = name
            self.val = val

    columns = {"name": "Name", "val": "Value"}
    rows = [Row("a", 1), Row("b", 2)]
    result = UserLog().table_formatted(columns=columns, rows=rows)
    assert "a" in result
    assert "b" in result


def test_disable_user_log(capsys):
    import amapy_utils.utils.log_utils as log_module
    original = log_module.DISABLE_USER_LOG_PRINTING
    try:
        disable_user_log()
        assert log_module.DISABLE_USER_LOG_PRINTING is True
        UserLog().info("should not print")
        assert capsys.readouterr().out == ""
    finally:
        log_module.DISABLE_USER_LOG_PRINTING = original


def test_bulletize():
    user_log = UserLog()
    items = ["Item 1", "Item 2"]
    result = user_log.bulletize(items)
    expected = "- Item 1\n- Item 2"
    assert result.strip() == expected


def test_dict_to_logs():
    user_log = UserLog()
    data = {"key1": "value1", "key2": "value2"}
    result = user_log.dict_to_logs(data)
    expected = "key1: value1,key2: value2"
    assert result == expected


def test_kilo_byte():
    # Test typical use case
    assert kilo_byte(1024) == 1
    # Test rounding up
    assert kilo_byte(1025) == 2
    # Test zero bytes
    assert kilo_byte(0) == 0
    # Test negative bytes
    assert kilo_byte(-1024) == -1


def test_comma_formatted():
    # Test typical use case
    assert comma_formatted(1000) == "1,000"
    # Test large number
    assert comma_formatted(1000000) == "1,000,000"
    # Test zero
    assert comma_formatted(0) == "0"
    # Test negative number
    assert comma_formatted(-1000) == "-1,000"
