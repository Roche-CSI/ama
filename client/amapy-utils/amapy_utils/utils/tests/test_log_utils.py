import colorama

from amapy_utils.utils import log_utils


def test_log_data_add():
    log_data = log_utils.LogData()
    message = "Test message"
    color = log_utils.LogColors.INFO
    log_data.add(message, color)
    assert len(log_data.data) == 1, "LogData should contain exactly one message."
    assert log_data.data[0] == {"message": message, "color": color}, "Values do not match the expected values."


def test_log_data_print_format():
    log_data = log_utils.LogData()
    log_data.data.clear()  # make sure data is empty
    messages = [("First message", log_utils.LogColors.ERROR), ("Second message", None)]
    expected_output = ""
    for message, color in messages:
        log_data.add(message, color)
        expected_output += f"{log_utils.colored_string(message, color)}\n" if color else f"{message}\n"
    assert log_data.print_format().strip() == expected_output.strip(), "Output does not match expected format."


def test_colorize_with_style():
    message = "Test message"
    color = log_utils.LogColors.ERROR
    style = "bold"
    expected_result = f"{colorama.Style.BRIGHT}{color}{message}{colorama.Style.RESET_ALL}"
    assert log_utils.colorize(message, color=color, style=style) == expected_result
    assert log_utils.colorize(message, color=color, style="dim").startswith(colorama.Style.DIM)
    assert log_utils.colorize(message, color=color, style="unknown").startswith(color)
    assert log_utils.colorize(message) == message


def test_bulletize():
    user_log = log_utils.UserLog()
    items = ["Item 1", "Item 2"]
    result = user_log.bulletize(items)
    expected = "- Item 1\n- Item 2"
    assert result.strip() == expected


def test_dict_to_logs():
    user_log = log_utils.UserLog()
    data = {"key1": "value1", "key2": "value2"}
    result = user_log.dict_to_logs(data)
    expected = "key1: value1,key2: value2"
    assert result == expected


def test_kilo_byte():
    # Test typical use case
    assert log_utils.kilo_byte(1024) == 1
    # Test rounding up
    assert log_utils.kilo_byte(1025) == 2
    # Test zero bytes
    assert log_utils.kilo_byte(0) == 0
    # Test negative bytes
    assert log_utils.kilo_byte(-1024) == -1


def test_comma_formatted():
    # Test typical use case
    assert log_utils.comma_formatted(1000) == "1,000"
    # Test large number
    assert log_utils.comma_formatted(1000000) == "1,000,000"
    # Test zero
    assert log_utils.comma_formatted(0) == "0"
    # Test negative number
    assert log_utils.comma_formatted(-1000) == "-1,000"


def test_user_log_messages(capsys):
    log = log_utils.UserLog()
    assert log.colors is log_utils.LogColors
    assert log.colorize("colored", log_utils.LogColors.INFO).endswith(colorama.Fore.RESET)

    log.indented_message("body")
    assert "body" in capsys.readouterr().out
    log.indented_message("body", title="Title")
    output = capsys.readouterr().out
    assert "Title" in output
    assert "body" in output

    log.error("error")
    log.info("info")
    log.alert("alert")
    log.success("success")
    output = capsys.readouterr().out
    for message in ("error", "info", "alert", "success"):
        assert message in output


def test_logging_helpers():
    assert log_utils.format_link("https://example.com").startswith("<")
    assert log_utils.format_link("https://example.com").endswith(">")
    assert log_utils.bold_string("bold").endswith(log_utils.END)
    assert log_utils.asset_logo() == log_utils.colored_string(
        "🅰🆂🆂🅴🆃-🅼🅰🅽🅰🅶🅴🆁", color=colorama.Fore.LIGHTYELLOW_EX
    )
    title = log_utils._user_log_title("Title")
    assert "Title" in title
    assert title.endswith(colorama.Fore.RESET)
    assert log_utils._visual_width("\033[31mred\033[0m") == 3
    assert log_utils._visual_center("x", 4) == " x  "
    boxed = log_utils._boxed_message("x")
    assert boxed.startswith("+")
    assert "\n" in boxed
